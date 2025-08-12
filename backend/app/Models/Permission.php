<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Permission extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionFactory> */
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'permission';

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    protected $incrementing = false;

    protected $fillable = [
        'coligate_id',
        'client_id',
        'profile_id',
        'name',
        'created_by',
        'updated_by',
    ];

    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    protected static function boot() {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function coligate() {
        return $this->belongsTo(Coligate::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function profile() {
        return $this->belongsTo(Profile::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function profilePermissions() {
        return $this->hasMany(ProfilePermission::class);
    }
}
