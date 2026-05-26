import { Operator, Machine, Material, WorkOrder } from '../models';

export const dashboardService = {
  async getOverview() {
    // Operator statistics
    const totalOperators = await Operator.count();
    const availableOperators = await Operator.count({ where: { status: 'available' } });
    const assignedOperators = await Operator.count({ where: { status: 'assigned' } });
    const onBreakOperators = await Operator.count({ where: { status: 'on-break' } });

    // Machine statistics
    const totalMachines = await Machine.count();
    const idleMachines = await Machine.count({ where: { status: 'idle' } });
    const busyMachines = await Machine.count({ where: { status: 'busy' } });
    const maintenanceMachines = await Machine.count({ where: { status: 'maintenance' } });

    // Material statistics
    const totalMaterials = await Material.count();
    const materials = await Material.findAll();
    const lowStockMaterials = materials.filter(
      (m) => parseFloat(m.availableQuantity.toString()) < parseFloat(m.quantity.toString()) * 0.2
    ).length;

    // Work order statistics
    const totalWorkOrders = await WorkOrder.count();
    const pendingWorkOrders = await WorkOrder.count({ where: { status: 'pending' } });
    const inProgressWorkOrders = await WorkOrder.count({ where: { status: 'in-progress' } });
    const completedWorkOrders = await WorkOrder.count({ where: { status: 'completed' } });

    return {
      operators: {
        total: totalOperators,
        available: availableOperators,
        assigned: assignedOperators,
        onBreak: onBreakOperators,
      },
      machines: {
        total: totalMachines,
        idle: idleMachines,
        busy: busyMachines,
        maintenance: maintenanceMachines,
      },
      materials: {
        total: totalMaterials,
        lowStock: lowStockMaterials,
      },
      workOrders: {
        total: totalWorkOrders,
        pending: pendingWorkOrders,
        inProgress: inProgressWorkOrders,
        completed: completedWorkOrders,
      },
    };
  },
};
