/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { ActionType } from '../types';
import { LICENSE_TYPE } from '../../../licensing/common/types';
import { SERVER_LOG_ACTION_TYPE_ID } from '../builtin_action_types/server_log';
import { ES_INDEX_ACTION_TYPE_ID } from '../builtin_action_types/es_index';
import { CASE_ACTION_TYPE_ID } from '../../../case/server';
import { ActionTypeConfig, ActionTypeSecrets, ActionTypeParams } from '../types';

const ACTIONS_SCOPED_WITHIN_STACK = new Set([
  SERVER_LOG_ACTION_TYPE_ID,
  ES_INDEX_ACTION_TYPE_ID,
  CASE_ACTION_TYPE_ID,
]);

export function ensureSufficientLicense<
  Config extends ActionTypeConfig,
  Secrets extends ActionTypeSecrets,
  Params extends ActionTypeParams,
  ExecutorResultData
>(actionType: ActionType<Config, Secrets, Params, ExecutorResultData>) {
  if (!(actionType.minimumLicenseRequired in LICENSE_TYPE)) {
    throw new Error(`"${actionType.minimumLicenseRequired}" is not a valid license type`);
  }
  if (
    LICENSE_TYPE[actionType.minimumLicenseRequired] < LICENSE_TYPE.gold &&
    !ACTIONS_SCOPED_WITHIN_STACK.has(actionType.id)
  ) {
    throw new Error(
      `Third party action type "${actionType.id}" can only set minimumLicenseRequired to a gold license or higher`
    );
  }
}
