import { Grid, Typography, CircularProgress } from '@mui/material';
const TSLOGO = "/logo/ts-logo-colored.svg";

export default function TranslationstudioLogo()
{
    return <Grid item xs={12} textAlign={"center"} style={{ paddingBottom: "4em"}}>
            <img className="translationstudiologo" src={TSLOGO} alt="" style={{ width: "100%", maxHeight: "100px", height: "100%"}}/>
        </Grid>
    
}

export function TranslationstudioLogoSmall()
{
    return <Grid item xs={12} textAlign={"center"} style={{ paddingBottom: "4em"}}>
            <img className="translationstudiologo" src={TSLOGO} alt="" style={{ width: "100%", maxHeight: "50px", height: "100%"}}/>
        </Grid>
}

export function TranslationstudioLoading(props: { text: string})
{
    return <Grid container rowGap={2}>
        <TranslationstudioLogo />
        <Grid item xs={12} textAlign={"center"}>
            <CircularProgress />
        </Grid>
        <Grid item xs={12} textAlign={"center"}> 
            <Typography component={"h2"}>{props.text}</Typography>
        </Grid>
    </Grid>
        
    
}