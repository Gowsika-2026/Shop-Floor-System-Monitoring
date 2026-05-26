import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OperatorsPage from '@pages/operators/OperatorsPage';
import operatorReducer from '@store/slices/operatorSlice';
import { operatorService } from '@services/operatorService';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('@services/operatorService');
jest.mock('react-toastify');

describe('OperatorsPage', () => {
  const mockOperators = [
    {
      id: 1,
      name: 'Alice',
      skills: ['welding'],
      certifications: ['ISO-9001'],
      status: 'available' as const
    },
    {
      id: 2,
      name: 'Bob',
      skills: ['assembly'],
      certifications: [],
      status: 'assigned' as const
    }
  ];

  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        operators: operatorReducer
      },
      preloadedState: {
        operators: {
          operators: mockOperators,
          loading: false
        }
      }
    });

    (operatorService.getAll as jest.Mock).mockResolvedValue(mockOperators);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <Provider store={store}>
        <OperatorsPage />
      </Provider>
    );
  };

  it('should render operators table', () => {
    renderPage();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('welding')).toBeInTheDocument();
  });

  it('should display status chips with correct colors', () => {
    renderPage();

    const availableChip = screen.getByText('available');
    const assignedChip = screen.getByText('assigned');

    expect(availableChip).toBeInTheDocument();
    expect(assignedChip).toBeInTheDocument();
  });

  it('should open add dialog when Add button clicked', async () => {
    renderPage();
    const user = userEvent.setup();

    const addButton = screen.getByRole('button', { name: /add operator/i });
    await user.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skills/i)).toBeInTheDocument();
  });

  it('should create new operator when form submitted', async () => {
    const newOperator = {
      id: 3,
      name: 'Charlie',
      skills: ['painting'],
      certifications: [],
      status: 'available' as const
    };
    (operatorService.create as jest.Mock).mockResolvedValue(newOperator);

    renderPage();
    const user = userEvent.setup();

    // Open dialog
    await user.click(screen.getByRole('button', { name: /add operator/i }));

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'Charlie');
    await user.type(screen.getByLabelText(/skills/i), 'painting');

    // Submit
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(operatorService.create).toHaveBeenCalledWith({
        name: 'Charlie',
        skills: ['painting'],
        certifications: [],
        status: 'available'
      });
      expect(toast.success).toHaveBeenCalledWith('Operator created successfully');
    });
  });

  it('should open edit dialog with operator data', async () => {
    renderPage();
    const user = userEvent.setup();

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('welding')).toBeInTheDocument();
  });

  it('should update operator when edit form submitted', async () => {
    const updatedOperator = { ...mockOperators[0], name: 'Alice Smith' };
    (operatorService.update as jest.Mock).mockResolvedValue(updatedOperator);

    renderPage();
    const user = userEvent.setup();

    // Open edit dialog
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Update name
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice Smith');

    // Submit
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(operatorService.update).toHaveBeenCalledWith(1, expect.objectContaining({
        name: 'Alice Smith'
      }));
      expect(toast.success).toHaveBeenCalledWith('Operator updated successfully');
    });
  });

  it('should delete operator after confirmation', async () => {
    window.confirm = jest.fn(() => true);
    (operatorService.delete as jest.Mock).mockResolvedValue(undefined);

    renderPage();
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(operatorService.delete).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Operator deleted successfully');
    });
  });

  it('should not delete if user cancels confirmation', async () => {
    window.confirm = jest.fn(() => false);

    renderPage();
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(operatorService.delete).not.toHaveBeenCalled();
  });

  it('should show error toast on failed create', async () => {
    (operatorService.create as jest.Mock).mockRejectedValue(new Error('Failed'));

    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /add operator/i }));
    await user.type(screen.getByLabelText(/name/i), 'Test');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to save operator');
    });
  });
});
