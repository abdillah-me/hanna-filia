# Placeholder photographs

Every `.jpg` in this directory is a temporary placeholder from Unsplash, used
under the [Unsplash License](https://unsplash.com/license). None of them show
Hanna Filia, its students, or its staff.

**To replace one of the 22 non-teacher photographs:** save your own photograph
over the file of the same name, keeping the `.jpg` extension. Nothing else
needs to change — the photo is rendered with `object-cover`, which crops it to
fill the slot's existing aspect ratio (see `src/content/images.ts`). Don't try
to match or "correct" that ratio to your new photo's actual dimensions — the
ratio is the slot's shape, not a measurement of the file, and changing it is a
layout change, not a photo swap.

Source for each file: `https://unsplash.com/photos/<id>`, with the ids listed in
`scripts/fetch-photos.mjs`.

The six teacher cards deliberately use no photograph at all. They render
initials instead, because showing a stranger's face beside a named,
credentialled teacher would misrepresent a real person. Switching one to a
real portrait takes **two** steps, not one — dropping the file into this
folder alone does nothing, because nothing on the site inspects the
filesystem:

1. Add `teacher-1.jpg` … `teacher-6.jpg` to this folder (matching each
   person's `imageKey` in `src/content/teachers.ts`).
2. In `src/content/images.ts`, set that teacher's `src` to
   `/images/teacher-N.jpg`. See `README.md` for the full explanation.
