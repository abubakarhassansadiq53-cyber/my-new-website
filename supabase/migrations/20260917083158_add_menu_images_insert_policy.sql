-- Add INSERT policy for menu-images storage bucket so admin can upload
CREATE POLICY "admin_insert_menu_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menu-images');
