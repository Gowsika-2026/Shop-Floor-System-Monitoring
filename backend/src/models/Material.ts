import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MaterialAttributes {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  allocatedQuantity: number;
  availableQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MaterialCreationAttributes extends Optional<MaterialAttributes, 'id' | 'allocatedQuantity' | 'availableQuantity'> {}

class Material extends Model<MaterialAttributes, MaterialCreationAttributes> implements MaterialAttributes {
  public id!: number;
  public name!: string;
  public quantity!: number;
  public unit!: string;
  public location!: string;
  public allocatedQuantity!: number;
  public availableQuantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Material.init(
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
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    allocatedQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    availableQuantity: {
      type: DataTypes.VIRTUAL,
      get() {
        return parseFloat(this.quantity.toString()) - parseFloat(this.allocatedQuantity.toString());
      },
    },
  },
  {
    sequelize,
    tableName: 'materials',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['location'] },
    ],
  }
);

export default Material;
