CREATE TABLE IF NOT EXISTS public.chronicle (
  id BIGSERIAL PRIMARY KEY,
  event_at TIMESTAMPTZ NOT NULL,
  nation VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  author_name VARCHAR(50) NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chronicle_event_at_idx ON public.chronicle (event_at DESC);
CREATE INDEX IF NOT EXISTS chronicle_nation_idx ON public.chronicle (nation);
CREATE INDEX IF NOT EXISTS chronicle_is_deleted_idx ON public.chronicle (is_deleted);

TRUNCATE TABLE public.chronicle RESTART IDENTITY;

INSERT INTO public.chronicle (
  event_at,
  nation,
  content,
  is_deleted,
  author_name
)
VALUES
  ('2026-08-01 00:00:00+09:00', '위나라, 촉나라, 오나라', '위·촉·오 천하삼분, 삼국쟁패의 막이 오른다.', FALSE, 'system');
