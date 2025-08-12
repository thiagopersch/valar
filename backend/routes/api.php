<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* Route::prefix('auth')->group(function () {
    Route::post('login', [LoginController::class, 'login']);
});

Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout/{user}', [loginController::class, 'logout']);
}); */


Route::prefix('admin')->middleware(['cors', 'auth:sanctum'])->group(function () {
    Route::apiResource('users', UserController::class);
    /* Route::apiResource('profiles', \App\Http\Controllers\Api\ProfileController::class);
    Route::apiResource('modules', \App\Http\Controllers\Api\ModuleController::class);
    Route::apiResource('persons', \App\Http\Controllers\Api\PersonController::class);
    Route::apiResource('churches', \App\Http\Controllers\ChurchController::class);
    Route::apiResource('occupations', \App\Http\Controllers\Api\OccupationController::class);
    Route::apiResource('event-types', \App\Http\Controllers\Api\EventTypeController::class);
    Route::apiResource('member-origins', \App\Http\Controllers\Api\MemberOriginController::class); */
});

/* Route::prefix('aux')->middleware(['cors', 'auth:sanctum'])->group(function () {
    Route::get('civil-status', [\App\Http\Controllers\Api\Auxiliares\CivilStatusController::class, 'index']);
    Route::get('color-race', [\App\Http\Controllers\Api\Auxiliares\ColorRaceController::class, 'index']);
    Route::get('formations', [\App\Http\Controllers\Api\Auxiliares\FormationController::class, 'index']);
    Route::get('kinships', [\App\Http\Controllers\Api\Auxiliares\KinshipController::class, 'index']);
    Route::get('member-situation', [\App\Http\Controllers\Api\Auxiliares\MemberSituationController::class, 'index']);
}); */
