import { model, Schema } from 'mongoose';
import { TTest } from './test.interface';



const TestSchema = new Schema<TTest>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  }
);



export const Test = model<TTest>('Test', TestSchema);
