import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

interface DashboardCardProps {
  headerText: string;
  url: string;
}

export default function DashboardCard({ headerText, url }: DashboardCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(url);
  };
  return (
    <Card sx={{ maxWidth: "400px", margin: "auto" }} onClick={handleClick}>
      <CardContent>
        <Typography variant="h5" component="div">
          {headerText}
        </Typography>
        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          subheading
        </Typography> */}
        {/* <Typography variant="body2">description</Typography> */}
      </CardContent>
    </Card>
  );
}
