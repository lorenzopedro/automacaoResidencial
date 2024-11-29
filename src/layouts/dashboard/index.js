// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch"; // Import do Switch  
import React, { useState } from "react"; // Import do useState
import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { PiGarageFill } from "react-icons/pi";
import { FaLightbulb } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

// MQTT
import { publishMessage } from "mqttService";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const [lightStatus, setLightStatus] = useState(false);
  const [acStatus, setAcStatus] = useState(false);
  const [garageStatus, setGarageStatus] = useState(false);
  const [roomLightStatus, setRoomLightStatus] = useState(false);

  // Serviço de comunicação com ESP32
const ESP32_URL = "http://<ENDERECO_DO_ESP32>"; // Substitua pelo IP do seu ESP32

const toggleDeviceESP32 = async (endpoint) => {
  try {
    const response = await fetch(`${ESP32_URL}/${endpoint}`);
    const result = await response.text();
    return result; // Retorna o texto recebido (estado atualizado do dispositivo)
  } catch (error) {
    console.error("Erro ao comunicar com ESP32:", error);
    return "Erro";
  }
};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
             {/* Luz da Sala */}
          <Grid item xs={12} md={6} xl={3}>
            <MiniStatisticsCard
              title={{ text: <VuiTypography variant="h6">Luz da Sala</VuiTypography> }}
              count={
                <VuiBox mt={1}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch
                      checked={lightStatus}
                      onChange={async () => {
                        const newStatus = await toggleDeviceESP32("led/toggle");
                        setLightStatus(newStatus === "Ligado");
                      }}
                      color="success"
                    />
                    <VuiTypography variant="button">
                      {lightStatus ? "Ligado" : "Desligado"}
                    </VuiTypography>
                  </Stack>
                </VuiBox>
              }
              icon={{ color: "white", component: <FaLightbulb size="20px" /> }}
            />
          </Grid>

             {/* Ar Condicionado */}
          <Grid item xs={12} md={6} xl={3}>
            <MiniStatisticsCard
              title={{ text: <VuiTypography variant="h6">Ar Condicionado</VuiTypography> }}
              count={
                <VuiBox mt={1}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch
                      checked={acStatus}
                      onChange={async () => {
                        const newStatus = await toggleDeviceESP32("fan/toggle");
                        setAcStatus(newStatus === "Ligado");
                      }}
                      color="success"
                    />
                    <VuiTypography variant="button">
                      {acStatus ? "Ligado" : "Desligado"}
                    </VuiTypography>
                  </Stack>
                </VuiBox>
              }
              icon={{ color: "white", component: <TbAirConditioning size="20px" /> }}
            />
          </Grid>

            {/* Portão da Garagem */}
          <Grid item xs={12} md={6} xl={3}>
            <MiniStatisticsCard
              title={{ text: <VuiTypography variant="h6">Portão da Garagem</VuiTypography> }}
              count={
                <VuiBox mt={1}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch
                      checked={garageStatus}
                      onChange={async () => {
                        const newStatus = await toggleDeviceESP32(
                          garageStatus ? "servo/close" : "servo/open"
                        );
                        setGarageStatus(newStatus === "Aberto");
                      }}
                      color="error"
                    />
                    <VuiTypography variant="button">
                      {garageStatus ? "Aberto" : "Fechado"}
                    </VuiTypography>
                  </Stack>
                </VuiBox>
              }
              icon={{ color: "white", component: <PiGarageFill size="20px" /> }}
            />
          </Grid>

            {/* Card: Luz do Quarto */}
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{
                  text: (
                    <VuiTypography
                      variant="h6"
                      fontWeight="bold"
                      fontSize="1.5rem"
                      color="white" // Definindo a cor como branca
                    >
                      Luz do Quarto
                    </VuiTypography>
                  ), // Aumentando o tamanho do texto
                }}
                count={
                  <VuiBox mt={1}> {/* Adicionando margem superior para separar o texto do botão */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Switch
                        checked={roomLightStatus}
                        onChange={() => {
                          const newStatus = !roomLightStatus;
                          setRoomLightStatus(newStatus);
                          const message = newStatus ? "Ligado" : "Desligado";
                          publishMessage("luz/quarto", message); // Tópico: luz/quarto
                        }}
                        color="success"
                      />
                      <VuiTypography variant="button">
                        {roomLightStatus ? "Ligado" : "Desligado"}
                      </VuiTypography>
                    </Stack>
                  </VuiBox>
                }
                percentage={{ color: "success", text: "" }}
                icon={{ color: "info", component: <FaRegLightbulb size="20px" color="white" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={5}>
              <WelcomeMark />
            </Grid>
            <Grid item xs={12} lg={6} xl={3}>
              <SatisfactionRate />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking />
            </Grid>
          </Grid>
        </VuiBox>

        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}></Grid>
          <Grid item xs={12} md={6} lg={4}></Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
