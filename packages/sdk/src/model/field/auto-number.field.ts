import { AutoNumberFieldCore } from '@teable/core';
import { Mixin } from 'ts-mixer';
import { Field } from './field';

export class AutoNumberField extends Mixin(AutoNumberFieldCore, Field) {}
