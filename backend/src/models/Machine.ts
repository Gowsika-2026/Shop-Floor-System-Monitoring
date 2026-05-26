import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MachineAttributes {
  id: number;
  name: string;
  type: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'maintenance' | 'breakdown';
  currentWorkOrder: number | null;
  lastMaintenanceDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MachineCreationAttributes extends Optional<MachineAttributes, 'id' | 'currentWorkOrder'> {}

class Machine extends Model<MachineAttributes, MachineCreationAttributes> implements MachineAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public capabilities!: string[];
  public status!: 'idle' | 'busy' | 'maintenance' | 'breakdown';
  public currentWorkOrder!: number | null;
  public lastMaintenanceDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Machine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    capabilities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('idle', 'busy', 'maintenance', 'breakdown'),
      allowNull: false,
      defaultValue: 'idle',
    },
    currentWorkOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'work_orders',
        key: 'id',
      },
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'machines',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['currentWorkOrder'] },
    ],
  }
);

export default Machine;
