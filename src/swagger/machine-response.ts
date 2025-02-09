import { EStatus } from "src/shared/enums";

export const createMachineResponse = {
  201: {
    status: 201,
    description: 'Máquina criada com sucesso.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 201 },
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'any_id' },
            name: { type: 'string', example: 'any_name' },
            location: { type: 'string', example: '' },
            status: { type: 'string', enum: EStatus, example: EStatus.OFF },
          }
        }
      },
    }
  },
  400: {
    status: 400,
    description: 'Existem campos inválidos na requisição.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 400 },
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Existem campos inválidos na requisição.' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'any_field.' },
                  messages: { type: 'string', example: 'any_message.' }
                }
              }
            }
          }
        }
      }
    }
  },
  404: {
    status: 404,
    description: 'Máquina não encontrada.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 404 },
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'any_message.' },
            process: { type: 'string', example: 'any_process.' }
          }
        }
      }
    }
  }
}