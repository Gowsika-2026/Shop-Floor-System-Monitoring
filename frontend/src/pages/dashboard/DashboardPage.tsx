import { useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { People, Precision, Inventory, Assignment } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { setStats, setLoading } from '@store/slices/dashboardSlice';
import { dashboardService } from '@services/dashboardService';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const data = await dashboardService.getOverview();
        dispatch(setStats(data));
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <Container maxWidth="xl">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Operators',
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      stats: [
        { label: 'Total', value: stats.operators.total },
        { label: 'Available', value: stats.operators.available, color: 'success.main' },
        { label: 'Assigned', value: stats.operators.assigned, color: 'info.main' },
        { label: 'On Break', value: stats.operators.onBreak, color: 'warning.main' },
      ],
    },
    {
      title: 'Machines',
      icon: <Precision sx={{ fontSize: 40, color: 'secondary.main' }} />,
      stats: [
        { label: 'Total', value: stats.machines.total },
        { label: 'Idle', value: stats.machines.idle, color: 'success.main' },
        { label: 'Busy', value: stats.machines.busy, color: 'info.main' },
        { label: 'Maintenance', value: stats.machines.maintenance, color: 'warning.main' },
      ],
    },
    {
      title: 'Materials',
      icon: <Inventory sx={{ fontSize: 40, color: 'info.main' }} />,
      stats: [
        { label: 'Total', value: stats.materials.total },
        { label: 'Low Stock', value: stats.materials.lowStock, color: 'error.main' },
      ],
    },
    {
      title: 'Work Orders',
      icon: <Assignment sx={{ fontSize: 40, color: 'success.main' }} />,
      stats: [
        { label: 'Total', value: stats.workOrders.total },
        { label: 'Pending', value: stats.workOrders.pending, color: 'warning.main' },
        { label: 'In Progress', value: stats.workOrders.inProgress, color: 'info.main' },
        { label: 'Completed', value: stats.workOrders.completed, color: 'success.main' },
      ],
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{card.title}</Typography>
                  {card.icon}
                </Box>
                {card.stats.map((stat, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={stat.color || 'text.primary'}>
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
