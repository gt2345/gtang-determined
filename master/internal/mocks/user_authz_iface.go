// Code generated by mockery v2.13.1. DO NOT EDIT.

package mocks

import (
	context "context"

	mock "github.com/stretchr/testify/mock"

	model "github.com/determined-ai/determined/master/pkg/model"
)

// UserAuthZ is an autogenerated mock type for the UserAuthZ type
type UserAuthZ struct {
	mock.Mock
}

// CanCreateUser provides a mock function with given fields: ctx, curUser, userToAdd, agentUserGroup
func (_m *UserAuthZ) CanCreateUser(ctx context.Context, curUser model.User, userToAdd model.User, agentUserGroup *model.AgentUserGroup) error {
	ret := _m.Called(ctx, curUser, userToAdd, agentUserGroup)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User, *model.AgentUserGroup) error); ok {
		r0 = rf(ctx, curUser, userToAdd, agentUserGroup)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanCreateUsersOwnSetting provides a mock function with given fields: ctx, curUser, setting
func (_m *UserAuthZ) CanCreateUsersOwnSetting(ctx context.Context, curUser model.User, setting model.UserWebSetting) error {
	ret := _m.Called(ctx, curUser, setting)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.UserWebSetting) error); ok {
		r0 = rf(ctx, curUser, setting)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanGetUser provides a mock function with given fields: ctx, curUser, targetUser
func (_m *UserAuthZ) CanGetUser(ctx context.Context, curUser model.User, targetUser model.User) (bool, error) {
	ret := _m.Called(ctx, curUser, targetUser)

	var r0 bool
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User) bool); ok {
		r0 = rf(ctx, curUser, targetUser)
	} else {
		r0 = ret.Get(0).(bool)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(context.Context, model.User, model.User) error); ok {
		r1 = rf(ctx, curUser, targetUser)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// CanGetUsersImage provides a mock function with given fields: ctx, curUser, targetUsername
func (_m *UserAuthZ) CanGetUsersImage(ctx context.Context, curUser model.User, targetUsername model.User) error {
	ret := _m.Called(ctx, curUser, targetUsername)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User) error); ok {
		r0 = rf(ctx, curUser, targetUsername)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanGetUsersOwnSettings provides a mock function with given fields: ctx, curUser
func (_m *UserAuthZ) CanGetUsersOwnSettings(ctx context.Context, curUser model.User) error {
	ret := _m.Called(ctx, curUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User) error); ok {
		r0 = rf(ctx, curUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanResetUsersOwnSettings provides a mock function with given fields: ctx, curUser
func (_m *UserAuthZ) CanResetUsersOwnSettings(ctx context.Context, curUser model.User) error {
	ret := _m.Called(ctx, curUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User) error); ok {
		r0 = rf(ctx, curUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersActive provides a mock function with given fields: ctx, curUser, targetUser, toActiveVal
func (_m *UserAuthZ) CanSetUsersActive(ctx context.Context, curUser model.User, targetUser model.User, toActiveVal bool) error {
	ret := _m.Called(ctx, curUser, targetUser, toActiveVal)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User, bool) error); ok {
		r0 = rf(ctx, curUser, targetUser, toActiveVal)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersAdmin provides a mock function with given fields: ctx, curUser, targetUser, toAdminVal
func (_m *UserAuthZ) CanSetUsersAdmin(ctx context.Context, curUser model.User, targetUser model.User, toAdminVal bool) error {
	ret := _m.Called(ctx, curUser, targetUser, toAdminVal)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User, bool) error); ok {
		r0 = rf(ctx, curUser, targetUser, toAdminVal)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersAgentUserGroup provides a mock function with given fields: ctx, curUser, targetUser, agentUserGroup
func (_m *UserAuthZ) CanSetUsersAgentUserGroup(ctx context.Context, curUser model.User, targetUser model.User, agentUserGroup model.AgentUserGroup) error {
	ret := _m.Called(ctx, curUser, targetUser, agentUserGroup)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User, model.AgentUserGroup) error); ok {
		r0 = rf(ctx, curUser, targetUser, agentUserGroup)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersDisplayName provides a mock function with given fields: ctx, curUser, targetUser
func (_m *UserAuthZ) CanSetUsersDisplayName(ctx context.Context, curUser model.User, targetUser model.User) error {
	ret := _m.Called(ctx, curUser, targetUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User) error); ok {
		r0 = rf(ctx, curUser, targetUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersPassword provides a mock function with given fields: ctx, curUser, targetUser
func (_m *UserAuthZ) CanSetUsersPassword(ctx context.Context, curUser model.User, targetUser model.User) error {
	ret := _m.Called(ctx, curUser, targetUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User) error); ok {
		r0 = rf(ctx, curUser, targetUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// CanSetUsersUsername provides a mock function with given fields: ctx, curUser, targetUser
func (_m *UserAuthZ) CanSetUsersUsername(ctx context.Context, curUser model.User, targetUser model.User) error {
	ret := _m.Called(ctx, curUser, targetUser)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, model.User, model.User) error); ok {
		r0 = rf(ctx, curUser, targetUser)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// FilterUserList provides a mock function with given fields: ctx, curUser, users
func (_m *UserAuthZ) FilterUserList(ctx context.Context, curUser model.User, users []model.FullUser) ([]model.FullUser, error) {
	ret := _m.Called(ctx, curUser, users)

	var r0 []model.FullUser
	if rf, ok := ret.Get(0).(func(context.Context, model.User, []model.FullUser) []model.FullUser); ok {
		r0 = rf(ctx, curUser, users)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]model.FullUser)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(context.Context, model.User, []model.FullUser) error); ok {
		r1 = rf(ctx, curUser, users)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewUserAuthZ interface {
	mock.TestingT
	Cleanup(func())
}

// NewUserAuthZ creates a new instance of UserAuthZ. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewUserAuthZ(t mockConstructorTestingTNewUserAuthZ) *UserAuthZ {
	mock := &UserAuthZ{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
