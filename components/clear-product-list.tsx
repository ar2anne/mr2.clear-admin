import { Card, CardContent, CardMedia, Chip, Grid, Rating, Typography } from "@mui/material"
import { useRouter } from "next/router"

interface ClearProductListProps {
    items: any[]
}
export default function ClearProductList({ items }: ClearProductListProps) {
    const router = useRouter();
    return <Grid container spacing={1.5}>
        {items.map((item, i) => <Grid item lg={3} xs={6} key={i}>
            <Card style={{
                cursor: "pointer",
                position: "relative"
            }}
                onClick={() => router.push("/browse/" + item.mId)}>
                <CardMedia
                    component="img"
                    height="200"
                    image={item.mMobileImageUrl}
                    onError={(e) => {
                        var target = e.target as any;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/150"
                    }} />
                {item.mOutOfStock && <Chip
                    style={{
                        position: "absolute",
                        inset: 0,
                        margin: 'auto',
                        borderRadius: 0
                    }}
                    label="Out of Stock"
                    color="warning" />}
                <CardContent>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: '100%' }}>
                        <Typography noWrap variant="body1">{item.mShortDisplayName}</Typography>
                    </div>
                    {item.mPrice != item.mDueToday ?
                        <>
                            <Typography variant="body2" color="gray" style={{
                                textDecoration: "linethrough"
                            }}>${item.mPrice}</Typography>
                            <Typography variant="body2" color="primary">${item.mDueToday}</Typography>
                        </> :
                        <Typography variant="body2" color="primary">${item.mPrice}</Typography>
                    }
                    <Rating value={item.mStarRatings}
                        readOnly />
                </CardContent>
            </Card>
        </Grid>)}
    </Grid>
}