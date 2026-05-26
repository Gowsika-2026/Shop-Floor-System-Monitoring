import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { setOperators, addOperator, updateOperator as updateOperatorState, removeOperator, setLoading } from '@store/slices/operatorSlice';
import { operatorService } from '@services/operatorService';
import { Operator } from '@store/slices/operatorSlice';
import { toast } from 'react-toastify';
import { getStatusColor, formatStatus } from '@utils/statusColors';

const OperatorsPage = () => {
  const dispatch = useAppDispatch();
  const { operators, loading } = useAppSelector((state) => state.operators);
  const [open, setOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    certifications: '',
    status: 'available' as 'available' | 'assigned' | 'on-break' | 'absent',
  });

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      dispatch(setLoading(true));
      const data = await operatorService.getAll();
      dispatch(setOperators(data));
    } catch (error) {
      toast.error('Failed to load operators');
    }
  };

  const handleOpen = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormData({
        name: operator.name,
        skills: operator.skills.join(', '),
        certifications: operator.certifications.join(', '),
        status: operator.status,
      });
    } else {
      setEditingOperator(null);
      setFormData({ name: '', skills: '', certifications: '', status: 'available' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingOperator(null);
  };

  const handleSubmit = async () => {
    try {
      const operatorData = {
        name: formData.name,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: formData.certifications.split(',').map((c) => c.trim()).filter(Boolean),
        status: formData.status,
      };

      if (editingOperator) {
        const updated = await operatorService.update(editingOperator.id, operatorData);
        dispatch(updateOperatorState(updated));
        toast.success('Operator updated successfully');
      } else {
        const created = await operatorService.create(operatorData);
        dispatch(addOperator(created));
        toast.success('Operator created successfully');
      }
      handleClose();
    } catch (error) {
      toast.error('Failed to save operator');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this operator?')) {
      try {
        await operatorService.delete(id);
        dispatch(removeOperator(id));
        toast.success('Operator deleted successfully');
      } catch (error) {
        toast.error('Failed to delete operator');
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Operators</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Operator
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Certifications</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operators.map((operator) => (
              <TableRow key={operator.id}>
                <TableCell>{operator.name}</TableCell>
                <TableCell>{operator.skills.join(', ')}</TableCell>
                <TableCell>{operator.certifications.join(', ')}</TableCell>
                <TableCell>
                  <Chip label={operator.status} color={getStatusColor(operator.status) as any} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(operator)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(operator.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOperator ? 'Edit Operator' : 'Add Operator'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Skills (comma-separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Certifications (comma-separated)"
            value={formData.certifications}
            onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            margin="normal"
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="on-break">On Break</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingOperator ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OperatorsPage;
