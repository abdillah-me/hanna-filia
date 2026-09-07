# Placeholder photographs

Every `.jpg` in this directory is a temporary placeholder from Unsplash, used
under the [Unsplash License](https://unsplash.com/license). None of them show
Hanna Filia, its students, or its staff.

**To replace one:** save your own photograph over the file of the same name,
keeping the `.jpg` extension. Nothing in the code needs to change. Match the
aspect ratio listed in `src/content/images.ts` so the layout does not shift.

Source for each file: `https://unsplash.com/photos/<id>`, with the ids listed in
`scripts/fetch-photos.mjs`.

The six teacher cards deliberately use no photograph at all. They render initials
instead, because showing a stranger's face beside a named teacher would
misrepresent a real person. Add `teacher-1.jpg` … `teacher-6.jpg` to this folder
and the cards switch to photographs automatically.
