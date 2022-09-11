import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Grid from '@mui/material/Grid';
import { Autoplay, Pagination, Navigation } from "swiper";
import { Box } from '@mui/system';
import { Button, Paper, Typography } from '@mui/material';
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from 'next/router';
import CardsSkeleton from '@components/card-skeleton';
import ClearProductList from '@components/clear-product-list';

const Home: NextPage = () => {
  const router = useRouter();
  const getSlidersClient = useQuery(["getSliders"], async () => {
    const result = await axios.get("/api/items/slider");
    return result.data as any[];
  }, {
    retry: (failedCount) => failedCount < 2,
    refetchOnWindowFocus: false
  });
  const getDailyClient = useQuery(["getDaily"], async () => {
    const result = await axios.get("/api/items/daily");
    return result.data as any[];
  }, {
    retry: (failedCount) => failedCount < 2,
    refetchOnWindowFocus: false
  });
  return <>
    <Swiper spaceBetween={5}
      slidesPerView={1}
      modules={[Autoplay, Pagination, Navigation]}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      autoplay={{
        delay: 4000
      }}>
      {getSlidersClient.data?.map((x, i) =>
        <SwiperSlide key={i}>
          <Paper sx={{
            backgroundColor: theme => theme.palette.primary.light,
            cursor: "pointer"
          }}
            onClick={() => router.push("/browse/" + x.mId)}>
            <Grid container>
              <Grid item lg={4} xs={4}>
                <img src={x.mLargeImage} style={{ width: "auto" }} />
              </Grid>
              <Grid item lg={8} xs={8} sx={{
                display: "flex",
                alignItems: "center"
              }}>
                <div>
                  <Typography variant="h3" color="white">{x.mName}</Typography>
                  <Typography variant="h3" color="yellow">${x.mPrice}</Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </SwiperSlide>
      )}
    </Swiper>
    <br />
    <Typography variant="h4">Daily Discover</Typography>
    <br />
    {getDailyClient.isLoading && <CardsSkeleton />}
    {getDailyClient.isSuccess && <ClearProductList items={getDailyClient.data ?? []} />}
    <br />
    <Box sx={{
      display: "flex",
      width: "100%",
      justifyContent: "center"
    }}>
      <Button 
        color="secondary" 
        variant="contained" 
        fullWidth
        onClick={()=> router.push("/browse")}>See more</Button>
    </Box>
  </>;
}

export default Home
