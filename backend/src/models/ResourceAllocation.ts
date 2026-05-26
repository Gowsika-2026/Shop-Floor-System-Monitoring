import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ResourceAllocationAttributes {
  id: number;
  workOrderId: number;
  resourceType: 'operator' | 'machine' | 'material';
  resourceId: number;
  quantity: number | null;
  allocatedBy: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResourceAllocationCreationAttributes extends Optional<ResourceAllocationAttributes, 'id' | 'quantity'> {}

class ResourceAllocation extends Model<ResourceAllocationAttributes, ResourceAllocationCreationAttributes> implements ResourceAllocationAttributes {
  public id!: number;
  public workOrderId!: number;
  public resourceType!: 'operator' | 'machine' | 'material';
  public resourceId!: number;
  public quantity!: number | null;
  public allocatedBy!: number;
  public status!: 'active' | 'completed' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ResourceAllocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'work_orders',
        key: 'id',
      },
    },
    resourceType: {
      type: DataTypes.ENUM('operator', 'machine', 'material'),
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'For materials only',
    },
    allocatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'resource_allocations',
    timestamps: true,
    indexes: [
      { fields: ['workOrderId'] },
      { fields: ['resourceType', 'resourceId'] },
      { fields: ['status'] },
    ],
  }
);

export default ResourceAllocation;
