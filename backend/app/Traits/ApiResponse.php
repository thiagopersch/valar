<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

trait ApiResponse
{
    /**
     * Retorna uma resposta de erro padronizada.
     *
     * @param string $message
     * @param int $statusCode
     * @param array $errors
     * @return JsonResponse
     */
    public function errorResponse(string $message, int $statusCode = 400, array $errors = []): JsonResponse {
        $response = [
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Formata os erros de validação em uma string legível.
     *
     * @param ValidationException $exception
     * @return JsonResponse
     */
    protected function formatValidationErrors(ValidationException $exception): JsonResponse {
        $errors = $exception->errors();
        $formattedErrors = [];

        foreach ($errors as $field => $messages) {
            // Pega apenas a primeira mensagem de erro para cada campo, se desejar
            $formattedErrors[] = "O campo {$field} é obrigatório";
        }

        // Junta todas as mensagens de erro em uma única string
        $message = implode('. ', $formattedErrors);

        return $this->errorResponse($message, 422, $formattedErrors);
    }
}
