CREATE TYPE public.stats_type AS ENUM (
    'QUEUED',
    'IMAGEPULL'
);

CREATE TABLE public.task_stats (
    task_id text NOT NULL REFERENCES public.tasks(task_id),
    resource_pool text NOT NULL,
    event_type public.stats_type NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NULL
);