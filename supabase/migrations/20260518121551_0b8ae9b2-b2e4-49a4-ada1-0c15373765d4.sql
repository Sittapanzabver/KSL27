UPDATE public.matches
SET season_id = '423c1997-b247-4db6-ac40-7b01ca536b1d',
    division_id = 'bd770ed0-a2f2-47e0-ab34-901a151e9f7c'
WHERE season_id IS NULL AND division_id IS NULL;