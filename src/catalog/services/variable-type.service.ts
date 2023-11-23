import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VariableType, VariableTypeDocument } from '../models/variable-type.model';
import { VariableTypeError } from '../errors/variable-type.error';
import { INewVariableType, IUpdatedVariableType } from '../interfaces';

@Injectable()
export class VariableTypeService {
  constructor(
    @InjectModel(VariableType.name)
    private readonly brandModel: Model<VariableTypeDocument>,
  ) {}

  async getAll(): Promise<VariableType[]> {
    return this.brandModel.find({}, { createdAt: 0, updatedAt: 0 }).lean();
  }

  public async getById(_id: string): Promise<VariableType> {
    const foundVariableType = await this.brandModel
      .findById(new Types.ObjectId(_id))
      .lean()
      .exec();
    if (!foundVariableType) {
      throw new Error(VariableTypeError.VARIABLE_TYPE_NOT_FOUND);
    }
    return foundVariableType;
  }

  public async create(newVariableType: INewVariableType): Promise<VariableType> {
    const document = await this.brandModel.create(newVariableType);
    const savedVariableType = await document.save();
    return savedVariableType.toJSON<VariableType>();
  }

  public async update(_id: string, updatedVariableType: IUpdatedVariableType) {
    return this.brandModel
      .findByIdAndUpdate(
        _id,
        {
          $set: updatedVariableType,
        },
        { new: true },
      )
  }

  public async delete(_id: string): Promise<boolean> {
    await this.brandModel.findByIdAndDelete(new Types.ObjectId(_id)).exec();
    return true;
  }
}
