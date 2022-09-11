import CardsSkeleton from '@components/card-skeleton';
import ClearProductList from '@components/clear-product-list';
import { Box, Button, Card, Divider, TextField } from '@mui/material';
import { CardMedia } from '@mui/material';
import { Grid } from '@mui/material';
import { CardContent } from '@mui/material';
import { Rating } from '@mui/material';
import { Pagination } from '@mui/material';
import { Chip } from '@mui/material';
import { Typography } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

interface PagerProps {
  pageCount: number,
  page: number,
  onChange?: (e: any, page: number) => void
}

interface PriceRangeProps {
  min: number | null,
  max: number | null
}

const Pager = ({ pageCount, page, onChange }: PagerProps) => <Grid container marginBottom={3}>
  <div style={{
    flexGrow: 1
  }} />
  <Pagination count={pageCount}
    page={page}
    onChange={onChange} />
</Grid>;

const rulePriceRange = ({ min, max }: PriceRangeProps) => {
  return (min ?? 0) <= 0 && (max ?? 0) <= 0 && "This is required";
}

const Index: NextPage = () => {
  const router = useRouter();
  const { s } = router.query;

  const getItemsClient = useQuery(["getItems"], async ({ signal }) => {
    const result = await axios.get("/api/items/", {
      signal,
      params: tableParams
    });
    return result.data as {
      items: any[],
      total: number,
      pageCount: number
    };
  }, {
    retry: (failedCount) => failedCount < 2,
    refetchOnWindowFocus: false
  });

  const priceRangeForm = useForm<PriceRangeProps>({
    defaultValues: {
      min: null,
      max: null
    }
  });

  const [tableParams, setTableParams] = useState<{
    page: number,
    s: string | string[],
    rate: number,
    minPrice: number | null,
    maxPrice: number | null
  }>({
    page: 1,
    s: s ?? "",
    rate: 0,
    minPrice: null,
    maxPrice: null
  });

  const applyPriceRange = ({ min, max }: PriceRangeProps) => {
    setTableParams((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    priceRangeForm.clearErrors(["min", "max"]);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(tableParams as any).toString();
    router.push("/browse?" + searchParams, undefined, {
      shallow: true
    }).then(async () => {
      getItemsClient.refetch();
    });
  }, [tableParams]);

  useEffect(() => {
    setTableParams((prev) => ({
      ...prev,
      s: s ?? ""
    }))
  }, [s]);

  return <>
    <Grid container spacing={1}>
      <Grid item lg={3} sx={{ display: { lg: "block", xs: "none" } }}>
        <Typography variant="h5">Search Filters</Typography>
        <Divider />
        <br />
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>Rating</Typography>

        {[...Array(5)].map((x, i) => {
          const val = 5 - i;
          return <Box key={i}
            sx={{
              cursor: "pointer",
              backgroundColor: (theme) => tableParams.rate == val ? theme.palette.grey[300] : "none",
              display: "flex",
              alignItems: "center",
              padding: "5px"
            }}
            onClick={() => {
              setTableParams((prev) => ({
                ...prev,
                page: 1,
                rate: tableParams.rate == val ? 0 : val
              }));
            }}>
            <Rating value={val}
              readOnly /> {(i > 0) && "& Up"}
          </Box>
        })}
        <br />
        <Typography variant="h6" sx={{ marginBottom: "5px" }}>Price Range</Typography>
        <form onSubmit={priceRangeForm.handleSubmit(applyPriceRange)}>
          <Grid container>
            <Grid item lg={5}>
              <Controller
                name="min"
                control={priceRangeForm.control}
                rules={{ required: rulePriceRange(priceRangeForm.getValues()) }}
                render={({ field }) => <>
                  <TextField {...field}
                    label="$ MIN"
                    size="small"
                  />
                </>}
              />
            </Grid>
            <Grid item lg={5}>
              <Controller
                name="max"
                control={priceRangeForm.control}
                rules={{ required: rulePriceRange(priceRangeForm.getValues()) }}
                render={({ field }) => <>
                  <TextField {...field}
                    label="$ MAX"
                    size="small"
                  />
                </>}
              />
            </Grid>
          </Grid>
          {priceRangeForm.formState.errors.max && priceRangeForm.formState.errors.min &&
            <Typography component="div" variant='caption' color="red">
              Invalid Price Range
            </Typography>}
          <br />
          <Button color="secondary" variant="contained" type="submit">Apply</Button>
        </form>
      </Grid>
      <Grid item lg={9} xs={12}>
        {s && (s.toString()).trim() && <Typography variant="h6">
          Search Result for: {s}
        </Typography>}
        <Pager
          page={tableParams.page}
          onChange={(e, page) => setTableParams((prev) => ({
            ...prev,
            page
          }))}
          pageCount={getItemsClient.data?.pageCount ?? 0} />
        {(getItemsClient.isRefetching || getItemsClient.isLoading) && <CardsSkeleton />}
        {!getItemsClient.isRefetching && <ClearProductList items={getItemsClient.data?.items ?? []} />}
        <br />
        <Pager
          page={tableParams.page}
          onChange={(e, page) => setTableParams((prev) => ({
            ...prev,
            page
          }))}
          pageCount={getItemsClient.data?.pageCount ?? 0} />
      </Grid>
    </Grid>
  </>
}

export default Index
