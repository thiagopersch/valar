<?php

namespace App\Http\Controllers\Api;
use App\Adapters\ApiPaginationAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        $perPage = (int) $request->get('per_page', 25);
        $page = (int) $request->get('page', 1);

        $users = User::with(['coligate', 'client', 'createdBy', 'updatedBy'])
            ->paginate($perPage, ['*'], 'page', $page);

        $url = $request->url();
        $counter = $users->total();
        $data = UserResource::collection($users->items());

        $adapter = new ApiPaginationAdapter(
            url: $url,
            counter: $counter,
            page: $page,
            perPage: $perPage,
            data: collect($users->items())
        );

        return $adapter->toJson();
    }

    public function store(StoreUserRequest $request) {
        $user = User::create($request->validated());
        return new UserResource($user);
    }

    public function show(User $user) {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user) {
        $user->update($request->validated());

        return new UserResource($user);
    }

    public function destroy(User $user) {
        $user->delete();

        return response(null, 204);
    }
}
