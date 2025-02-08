export const createMachineResponse = {
  201: {
    status: 201,
    schema: {
      code: 201,
      success: true,
      data: {
        id: 'any_id',
        name: 'any_name',
        location: 'any_location',
        status: 'OFF'
      }
    }
  },
  400: {
    status: 400,
    schema: {
      code: 400,
      success: false,
      error: {
        message: 'Existem campos inválidos na requisição',
        details: [
          {
            field: 'any_field',
            messages: 'any_message.'
          }
        ]
      }
    }
  },
  409: {
    status: 409,
    schema: {
      code: 409,
      success: false,
      error: {
        message: 'Já existe uma máquina com este nome.'
      }
    }
  }
}
