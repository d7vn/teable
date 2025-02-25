import { ActionPrefix, actionPrefixMap } from '@teable/core';
import type {
  ExcludeAction,
  FieldAction,
  RecordAction,
  TableAction,
  ViewAction,
} from '@teable/core';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_TABLE_PERMISSION = '/base/{baseId}/table/{tableId}/permission';

export type TablePermissionFieldAction = ExcludeAction<FieldAction, 'field|create'>;

export const FieldActionExcludeCreate = actionPrefixMap[ActionPrefix.Field].filter(
  (action) => action !== 'field|create'
) as TablePermissionFieldAction[];

export const tablePermissionVoSchema = z.object({
  table: z.record(z.custom<TableAction>(), z.boolean()),
  view: z.record(z.custom<ViewAction>(), z.boolean()),
  record: z.record(z.custom<RecordAction>(), z.boolean()),
  field: z.object({
    fields: z.record(z.string(), z.record(z.custom<TablePermissionFieldAction>(), z.boolean())),
    create: z.boolean(),
  }),
});

export type ITablePermissionVo = z.infer<typeof tablePermissionVoSchema>;

export const GetTablePermissionRoute = registerRoute({
  method: 'get',
  path: GET_TABLE_PERMISSION,
  summary: 'Get table permissions',
  description:
    "Retrieve the current user's permissions for a table, including access rights for table operations, views, records, and fields.",
  request: {
    params: z.object({
      baseId: z.string(),
      tableId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully retrieved table permissions for the current user.',
      content: {
        'application/json': {
          schema: tablePermissionVoSchema,
        },
      },
    },
  },
  tags: ['table'],
});

export const getTablePermission = async (baseId: string, tableId: string) => {
  return axios.get<ITablePermissionVo>(
    urlBuilder(GET_TABLE_PERMISSION, {
      baseId,
      tableId,
    })
  );
};
