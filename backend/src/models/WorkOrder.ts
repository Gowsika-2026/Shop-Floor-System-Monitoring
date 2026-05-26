import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface WorkOrderAttributes {
  id: number;
  description: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  requiredOperators: number;
  requiredMachines: string[];
  requiredMaterials: Array<{ materialId: number; quantity: number }>;
  estimatedDuration: number;
  startTime: Date | null;
  endTime: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkOrderCreationAttributes extends Optional<WorkOrderAttributes, 'id' | 'startTime' | 'endTime'> {}

class WorkOrder extends Model<WorkOrderAttributes, WorkOrderCreationAttributes> implements WorkOrderAttributes {
  public id!: number;
  public description!: string;
  public priority!: 'urgent' | 'high' | 'normal' | 'low';
  public status!: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  public requiredOperators!: number;
  public requiredMachines!: string[];
  public requiredMaterials!: Array<{ materialId: number; quantity: number }>;
  public estimatedDuration!: number;
  public startTime!: Date | null;
  public endTime!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WorkOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('urgent', 'high', 'normal', 'low'),
      allowNull: false,
      defaultValue: 'normal',
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'on-hold'),
      allowNull: false,
      defaultValue: 'pending',
    },
    requiredOperators: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    requiredMachines: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    requiredMaterials: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'work_orders',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default WorkOrder;
