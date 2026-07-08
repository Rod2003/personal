export type AudioTrack = {
  id: string;
  name: string;
  artist?: string;
  description?: string;
  file_path: string;
  created_at: string;
};

export type AudioTrackInsert = {
  name: string;
  artist?: string;
  description?: string;
  file_path: string;
};
