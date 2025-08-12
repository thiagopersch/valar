<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Client extends Model
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'clients';

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'name',
        'url',
        'token',
        'field_link_applyment',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'status' => 'boolean',
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

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function coligates() {
        return $this->hasMany(Coligate::class);
    }

    public function systems() {
        return $this->hasMany(System::class);
    }

    public function users() {
        return $this->hasMany(User::class);
    }

    public function profiles() {
        return $this->hasMany(Profile::class);
    }

    public function permissions() {
        return $this->hasMany(Permission::class);
    }

    public function profilePermissions() {
        return $this->hasMany(ProfilePermission::class);
    }
}
