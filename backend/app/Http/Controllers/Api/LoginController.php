<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

class LoginController extends Controller
{
    public function login(Request $request): JsonResponse {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return ApiResponseAdapter::error('E-mail ou senha inválidos', 401);
        }

        if (Auth::user()->status === false) {
            return ApiResponseAdapter::error('Usuário inativo', 403);
        }

        if (Auth::user()->client_id === null) {
            return ApiResponseAdapter::error('Usuário não vinculado a um cliente', 403);
        }

        if (Auth::user()->coligate_id === null) {
            return ApiResponseAdapter::error('Usuário não vinculado a uma coligada', 403);
        }

        $user = Auth::user();
        $token = $request->user()->createToken('token')->plainTextToken;

        $user->load('client', 'coligate');

        return ApiResponseAdapter::success(
            ['token' => $token, 'user' => $user],
            'Login realizado com sucesso'
        );
    }

    public function logout(User $user): JsonResponse {
        try {
            $user->tokens()->delete();

            return ApiResponseAdapter::success(message: 'Deslogado com sucesso');
        } catch (Exception $e) {
            return ApiResponseAdapter::error('Erro ao deslogar: ' . $e->getMessage(), 500);
        }
    }

    public function change_password(Request $request, string $userId): JsonResponse {
        try {
            $user = Auth::user();

            if (!$user) {
                return ApiResponseAdapter::error('Usuário não autenticado', 401);
            }

            if ($user->id !== $userId) {
                return ApiResponseAdapter::error('Não autorizado a alterar a senha deste usuário', 403);
            }

            $validator = Validator::make($request->all(), [
                'newPassword' => [
                    'required',
                    'string',
                    'min:8',
                    'max:30',
                    'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/',
                ],
            ], [
                'newPassword.required' => 'A nova senha é obrigatória.',
                'newPassword.min' => 'A senha deve ter no mínimo 8 caracteres.',
                'newPassword.max' => 'A senha deve ter no máximo 30 caracteres.',
                'newPassword.regex' => 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais (@,$,!,%,*,?,&).',
            ]);

            if ($validator->fails()) {
                return ApiResponseAdapter::error('Erro de validação', 422, $validator->errors()->toArray());
            }

            $user->password = Hash::make($request->newPassword);
            $user->save();

            return ApiResponseAdapter::success(message: 'Senha alterada com sucesso');
        } catch (Exception $e) {
            return ApiResponseAdapter::error('Erro ao alterar a senha: ' . $e->getMessage(), 500);
        }
    }
}
