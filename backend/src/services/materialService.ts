import { Material } from '../models';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { emitResourceUpdate } from '../socket';

export const materialService = {
  async getAll() {
    return await Material.findAll({
      order: [['name', 'ASC']],
    });
  },

  async getById(id: number) {
    const material = await Material.findByPk(id);
    if (!material) {
      throw new NotFoundError('Material not found');
    }
    return material;
  },

  async create(data: CreateMaterialDTO) {
    const material = await Material.create(data);
    emitResourceUpdate('material', material);
    return material;
  },

  async update(id: number, data: UpdateMaterialDTO) {
    const material = await this.getById(id);
    await material.update(data);
    emitResourceUpdate('material', material);
    return material;
  },

  async delete(id: number) {
    const material = await this.getById(id);
    
    if (material.allocatedQuantity > 0) {
      throw new ValidationError('Cannot delete material with active allocations');
    }

    await material.destroy();
  },

  async updateQuantity(id: number, quantity: number) {
    const material = await this.getById(id);
    
    if (quantity < material.allocatedQuantity) {
      throw new ValidationError('Quantity cannot be less than allocated quantity');
    }

    await material.update({ quantity });
    emitResourceUpdate('material', material);
    return material;
  },

  async allocate(materialId: number, quantity: number) {
    const material = await this.getById(materialId);
    
    const newAllocatedQuantity = parseFloat(material.allocatedQuantity.toString()) + quantity;
    
    if (newAllocatedQuantity > parseFloat(material.quantity.toString())) {
      throw new ValidationError('Insufficient material quantity');
    }

    await material.update({
      allocatedQuantity: newAllocatedQuantity,
    });

    emitResourceUpdate('material', material);
    return material;
  },

  async deallocate(materialId: number, quantity: number) {
    const material = await this.getById(materialId);
    
    const newAllocatedQuantity = parseFloat(material.allocatedQuantity.toString()) - quantity;
    
    if (newAllocatedQuantity < 0) {
      throw new ValidationError('Cannot deallocate more than allocated');
    }

    await material.update({
      allocatedQuantity: newAllocatedQuantity,
    });

    emitResourceUpdate('material', material);
    return material;
  },
};
