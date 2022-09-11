import { Box, CardMedia, Divider, Stack, Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import ErrorIcon from '@mui/icons-material/Error';
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { Rating } from "@mui/material";
import numeral from "numeral";
import { spacing } from "@mui/system";
import Button from "@mui/material/Button";
import specificationList from "@shared/specification-list";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    return {
        props: {
            id
        }
    };
}

const CardItem = ({ item }: any) => <>
    <Card sx={{
        display: {
            lg: "flex",
            xs: "block"
        }
    }}>
        <CardMedia
            component="img"
            sx={{
                width: {
                    lg: "40%",
                    xs: "100%"
                }
            }}
            image={item.mLargeImage} />
        <CardContent>
            <Typography variant="h5" flexWrap="wrap" width="100%">{item.skuDisplayName}</Typography>
            <Box sx={{
                display: "flex",
                gap: 2
            }}>
                <Box mt={0.2}>
                    <Typography variant="inherit"
                        color="secondary">
                        {numeral(item.mStarRatings).format("0,0.0")}
                    </Typography>
                </Box>

                <Rating value={item.mStarRatings} readOnly />
                <Divider orientation="vertical" flexItem />

                <Box mt={0.2}>
                    <Typography variant="inherit">
                        {numeral(item.mNumOfStarReviews).format("0a")} Ratings
                    </Typography>
                </Box>
            </Box>
            <Paper elevation={0} sx={{
                backgroundColor: (theme) => theme.palette.grey[100],
                padding: 1,
                width: "100vh",
                marginTop: 1
            }}>
                <Typography variant="h4" color="primary">${item.mPrice}</Typography>
            </Paper>
            <br />
            <Button size="large" variant="contained" color="secondary" disabled={item.mOutOfStock}>Buy now</Button>
            {item.mOutOfStock && <Typography variant="caption" color="warning" marginLeft={1}>This product is currently out of stock.</Typography>}
        </CardContent>
    </Card>
</>;

const CardDescription = ({ item }: any) => <>
    <Card elevation={0}>
        <CardContent>
            <Typography variant="h6">Product Specifications</Typography>
            {item && specificationList.map((spec, i) => <div key={i}>
                <Typography variant="caption">
                    {spec.caption}:
                </Typography>
                <Typography variant="caption" color="gray">
                    {typeof item[spec.field] == "boolean" ?
                        (item[spec.field] ? "Yes":"No") :
                        item[spec.field]
                    }
                </Typography>
            </div>)}
            <br />
            <Typography variant="h6">Product Description</Typography>
            <br />
            <Typography variant="caption"
                dangerouslySetInnerHTML={{
                    __html: item?.mDescription ?? ""
                }} />
        </CardContent>
    </Card>
</>;

export default ({ id }: any) => {
    const router = useRouter();

    const getItemClient = useQuery<any, AxiosError<any>>(["getItem"], async () => {
        const result = await axios.get("/api/items/" + id);
        return result.data as any;
    }, {
        refetchOnWindowFocus: false,
        retry: (count) => count < 2
    });

    return <>
        {getItemClient.isError && <Paper style={{
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}>
            <ErrorIcon color="warning" fontSize="large" />
            <Typography variant="h4" color="gray">Product not found!</Typography>
        </Paper>}

        {getItemClient.isSuccess && !getItemClient.isLoading && <CardItem item={getItemClient.data} />}
        <br />
        <CardDescription item={getItemClient.data} />
    </>;
}