ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_warning_sent timestamptz;
