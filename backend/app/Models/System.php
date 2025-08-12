<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class System extends Model
{
    /** @use HasFactory<\Database\Factories\SystemFactory> */
    use HasFactory;
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'system';

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    protected $incrementing = false;

    protected $fillable = [
        'coligate_id',
        'client_id',
        'code',
        'name',
        'fantasy_name',
        'description',
        'token',
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

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
