import User from './User';
import Operator from './Operator';
import Machine from './Machine';
import Material from './Material';
import WorkOrder from './WorkOrder';
import ResourceAllocation from './ResourceAllocation';

// Define associations
WorkOrder.hasMany(ResourceAllocation, {
  foreignKey: 'workOrderId',
  as: 'allocations',
});

ResourceAllocation.belongsTo(WorkOrder, {
  foreignKey: 'workOrderId',
  as: 'workOrder',
});

ResourceAllocation.belongsTo(User, {
  foreignKey: 'allocatedBy',
  as: 'allocator',
});

export {
  User,
  Operator,
  Machine,
  Material,
  WorkOrder,
  ResourceAllocation,
};
