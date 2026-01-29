// Audio track types for Supabase integration

export interface AudioTrack {
  id: string;
  name: string;
  artist?: string;
  file_path: string;
  created_at: string;
}

export interface AudioTrackInsert {
  name: string;
  artist?: string;
  file_path: string;
}
