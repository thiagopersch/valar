<?php

namespace App\Adapters;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ApiResponseAdapter
{
    // -------------------------------------------------------------------------
    // Respostas de sucesso
    // -------------------------------------------------------------------------

    public static function success(
        mixed $data = null,
        string $message = 'OK',
        int $status = 200,
        array $meta = []
    ): JsonResponse {
        $payload = ['success' => true, 'message' => $message];

        if (!is_null($data)) {
            $payload['data'] = $data;
        }

        if (!empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    public static function created(mixed $data, string $message = 'Criado com sucesso'): JsonResponse
    {
        return self::success($data, $message, 201);
    }

    public static function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    // -------------------------------------------------------------------------
    // Resposta paginada
    // -------------------------------------------------------------------------

    /**
     * Retorna uma resposta paginada padronizada.
     *
     * Uso:
     *   $paginator = User::paginate($perPage);                    // LengthAwarePaginator
     *   $resource  = UserResource::collection($paginator);       // ResourceCollection
     *   return ApiResponseAdapter::paginated($resource, $paginator, 'Usuários listados com sucesso');
     */
    public static function paginated(
        ResourceCollection $resource,
        LengthAwarePaginator $paginator,
        string $message = 'OK'
    ): JsonResponse {
        $currentPage  = $paginator->currentPage();
        $perPage      = $paginator->perPage();
        $total        = $paginator->total();
        $totalPages   = $paginator->lastPage();
        $baseUrl      = $paginator->url(1);                // URL sem parâmetros de página
        $baseUrl      = strtok($baseUrl, '?');             // remove query string gerada pelo paginator

        return self::success($resource, $message, meta: [
            'total'       => $total,
            'per_page'    => $perPage,
            'page'        => $currentPage,
            'total_pages' => $totalPages,
            'is_first'    => $currentPage === 1,
            'is_last'     => $currentPage === $totalPages,
            'current_url' => $baseUrl . '?page=' . $currentPage . '&per_page=' . $perPage,
            'next_url'    => $currentPage < $totalPages
                                ? $baseUrl . '?page=' . ($currentPage + 1) . '&per_page=' . $perPage
                                : null,
            'prev_url'    => $currentPage > 1
                                ? $baseUrl . '?page=' . ($currentPage - 1) . '&per_page=' . $perPage
                                : null,
        ]);
    }

    // -------------------------------------------------------------------------
    // Resposta de erro
    // -------------------------------------------------------------------------

    public static function error(
        string $message = 'Erro',
        int $status = 400,
        array $errors = []
    ): JsonResponse {
        $payload = ['success' => false, 'message' => $message];

        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
