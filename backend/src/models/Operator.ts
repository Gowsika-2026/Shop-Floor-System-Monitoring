import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface OperatorAttributes {
  id: number;
  name: string;
  skills: string[];
  certifications: string[];
  status: 'available' | 'assigned' | 'on-break' | 'absent';
  currentAssignment: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OperatorCreationAttributes extends Optional<OperatorAttributes, 'id' | 'currentAssignment'> {}

class Operator extends Model<OperatorAttributes, OperatorCreationAttributes> implements OperatorAttributes {
  public id!: number;
  public name!: string;
  public skills!: string[];
  public certifications!: string[];
  public status!: 'available' | 'assigned' | 'on-break' | 'absent';
  public currentAssignment!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Operator.init(
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
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('available', 'assigned', 'on-break', 'absent'),
      allowNull: false,
      defaultValue: 'available',
    },
    currentAssignment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'work_orders',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'operators',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['currentAssignment'] },
    ],
  }
);

export default Operator;
