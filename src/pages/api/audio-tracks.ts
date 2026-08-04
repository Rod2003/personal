import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabase } from "../../helpers/supabase";
import { AudioTrack } from "../../types/audio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getSupabase();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("audio_tracks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching audio tracks:", error);
      return res.status(500).json({ error: "Failed to fetch audio tracks" });
    }

    const tracksWithUrls: AudioTrack[] = (data || []).map((track) => ({
      ...track,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/${track.file_path}`,
    }));

    return res.status(200).json(tracksWithUrls);
  }

  if (req.method === "POST") {
    const { name, artist, description, file_path } = req.body;

    if (!name || !file_path) {
      return res.status(400).json({ error: "Name and file_path are required" });
    }

    const { data, error } = await supabase
      .from("audio_tracks")
      .insert([{ name, artist, description, file_path }])
      .select()
      .single();

    if (error) {
      console.error("Error creating audio track:", error);
      return res.status(500).json({ error: "Failed to create audio track" });
    }

    return res.status(201).json(data);
  }

  if (req.method === "DELETE") {
    const { id, file_path } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Track ID is required" });
    }

    const { error: dbError } = await supabase
      .from("audio_tracks")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Error deleting audio track:", dbError);
      return res.status(500).json({ error: "Failed to delete audio track" });
    }

    if (file_path) {
      const { error: storageError } = await supabase.storage
        .from("audio")
        .remove([file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
