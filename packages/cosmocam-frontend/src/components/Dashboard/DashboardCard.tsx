import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import { CardActionArea } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

interface DashboardCardProps {
  headerText: string;
  toolTipText: string;
  url: string;
  subheadingText?: string;
  children?: React.ReactNode;
}

export default function DashboardCard({
  headerText,
  toolTipText,
  url,
  subheadingText,
  children,
}: DashboardCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(url);
  };
  return (
    <Tooltip title={toolTipText}>
      <Card
        sx={{
          maxWidth: "400px",
          margin: "auto",
          color: "white",
          backgroundColor: "rgba(0, 58, 117, 0.2)",
          border: "1px solid rgb(19, 47, 76)",
        }}
        onClick={handleClick}
      >
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="div">
              {headerText}
            </Typography>
            {children}
            {subheadingText && (
              <Typography sx={{ mb: 1.5 }} color="white">
                {subheadingText}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
