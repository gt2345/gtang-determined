//go:build integration
// +build integration

package db

import (
	"context"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/types/known/structpb"

	"github.com/determined-ai/determined/master/pkg/etc"
	"github.com/determined-ai/determined/master/pkg/model"
	"github.com/determined-ai/determined/proto/pkg/checkpointv1"
	"github.com/determined-ai/determined/proto/pkg/modelv1"
	"github.com/determined-ai/determined/proto/pkg/trialv1"
)

var emptyMetadata = []byte(`{}`)

func TestModels(t *testing.T) {
	etc.SetRootPath(rootFromDB)
	db := MustResolveTestPostgres(t)
	defer PostTestTeardown()
	MustMigrateTestPostgres(t, db, migrationsFromDB)

	tests := []struct {
		name          string
		hasValidation bool
	}{
		{
			name:          "checkpoints with associated validations",
			hasValidation: true,
		},
		{
			name:          "checkpoints without associated validations",
			hasValidation: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user := requireMockUser(t, db)
			exp := requireMockExperiment(t, db, user)
			tr := requireMockTrial(t, db, exp)

			// Insert a model.
			now := time.Now()
			mdl := model.Model{
				Name:            uuid.NewString(),
				Description:     "some important model",
				CreationTime:    now,
				LastUpdatedTime: now,
				Labels:          []string{"some other label"},
				Username:        user.Username,
			}
			mdlNotes := "some notes"
			var pmdl modelv1.Model
			err := db.QueryProto(
				"insert_model", &pmdl, mdl.Name, mdl.Description, emptyMetadata,
				strings.Join(mdl.Labels, ","), mdlNotes, user.ID,
			)
			require.NoError(t, err)

			// Insert a checkpoint.
			const latestBatch = 10
			ckpt := &trialv1.CheckpointMetadata{
				TrialId:           int32(tr.ID),
				Uuid:              uuid.NewString(),
				Resources:         map[string]int64{"ok": 1.0},
				Framework:         "some framework",
				Format:            "some format",
				DeterminedVersion: "1.0.0",
				LatestBatch:       latestBatch,
			}
			err = db.AddCheckpointMetadata(context.TODO(), ckpt)
			require.NoError(t, err)

			// Which maybe has some metrics.
			var m *trialv1.TrialMetrics
			const metricValue = 1.0
			if tt.hasValidation {
				m = &trialv1.TrialMetrics{
					TrialId:     int32(tr.ID),
					LatestBatch: latestBatch,
					Metrics: &structpb.Struct{
						Fields: map[string]*structpb.Value{
							defaultSearcherMetric: {
								Kind: &structpb.Value_NumberValue{
									NumberValue: metricValue,
								},
							},
						},
					},
					BatchMetrics: []*structpb.Struct{},
				}
				err := db.AddValidationMetrics(context.TODO(), m)
				require.NoError(t, err)
			}

			var retCkpt checkpointv1.Checkpoint
			err = db.QueryProto("get_checkpoint", &retCkpt, ckpt.Uuid)
			require.NoError(t, err)

			requireModelVersionOK := func(expected, actual modelv1.ModelVersion) {
				require.Equal(t, expected.Name, actual.Name)
				require.Equal(t, expected.Model.Name, actual.Model.Name)
				require.Equal(t, expected.Checkpoint.Uuid, actual.Checkpoint.Uuid)
				if tt.hasValidation {
					require.Equal(t,
						expected.Checkpoint.SearcherMetric.Value,
						actual.Checkpoint.SearcherMetric.Value)
					require.Equal(t,
						expected.Checkpoint.ValidationState, actual.Checkpoint.ValidationState)
					require.NotNil(t, actual.Checkpoint.Metrics)
				} else {
					require.Nil(t, actual.Checkpoint.SearcherMetric)
					require.Equal(t,
						expected.Checkpoint.ValidationState, actual.Checkpoint.ValidationState)
					require.Nil(t, actual.Checkpoint.Metrics)
				}
			}

			// Register checkpoint as a model version.
			expected := modelv1.ModelVersion{
				Model:      &pmdl,
				Checkpoint: &retCkpt,
				Name:       "some name",
				Comment:    "empty",
				Username:   user.Username,
				Labels:     []string{"some label"},
				Notes:      "some notes",
			}
			var mv modelv1.ModelVersion
			err = db.QueryProto(
				"insert_model_version", &mv, pmdl.Id, ckpt.Uuid, expected.Name, expected.Comment,
				emptyMetadata, strings.Join(expected.Labels, ","), expected.Notes, user.ID,
			)
			require.NoError(t, err)
			requireModelVersionOK(expected, mv)

			var retMv modelv1.ModelVersion
			err = db.QueryProto("get_model_version", &retMv, pmdl.Id, mv.Id)
			require.NoError(t, err)
			requireModelVersionOK(expected, mv)

			var retMvs []*modelv1.ModelVersion
			err = db.QueryProto("get_model_versions", &retMvs, pmdl.Id)
			require.NoError(t, err)
			require.Len(t, retMvs, 1)
			requireModelVersionOK(expected, *retMvs[0])
		})
	}
}
