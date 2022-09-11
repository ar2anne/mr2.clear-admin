import { Stack, Skeleton, Grid } from "@mui/material";

const CardsSkeleton = () => <>
  <Grid container spacing={5}>
    {[...Array(10)].map((x, i) => <Grid item lg={3} xs={6} key={i}>
      <Stack spacing={1}>
        <Skeleton variant="rectangular" height={160} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </Stack>
    </Grid>)}
  </Grid>
</>;
export default CardsSkeleton;