<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

use App\Enums\HealthScore;
use App\Enums\ImplementationType;
use App\Enums\PriorityLevel;
use App\Enums\DemandLevel;
use App\Enums\Level;

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
        'email',
        'phone',
        'contact_name',
        'url',
        'token',
        'field_link_applyment',
        'status',
        'logo',
        'favicon',
        'color_primary',
        'background',
        'contract_start_date',
        'contract_end_date',
        'foundation_date',
        'old_contractual_level',
        'contractual_level',
        'potential_level',
        'demand_level',
        'priority_level',
        'commercial_user_id',
        'has_dedicated_customer_success',
        'customer_success_user_id',
        'project_manager_user_id',
        'relationship_manager_user_id',
        'has_dedicated_analyst',
        'dedicated_analyst_user_id',
        'analyst_type',
        'implementation_type',
        'general_observations',
        'health_score',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'status' => 'boolean',
        'has_dedicated_customer_success' => 'boolean',
        'has_dedicated_analyst' => 'boolean',
        'health_score' => HealthScore::class,
        'implementation_type' => ImplementationType::class,
        'priority_level' => PriorityLevel::class,
        'demand_level' => DemandLevel::class,
        'contractual_level' => Level::class,
        'potential_level' => Level::class,
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

    public function commercialUser() {
        return $this->belongsTo(User::class, 'commercial_user_id');
    }

    public function customerSuccessUser() {
        return $this->belongsTo(User::class, 'customer_success_user_id');
    }

    public function projectManagerUser() {
        return $this->belongsTo(User::class, 'project_manager_user_id');
    }

    public function relationshipManagerUser() {
        return $this->belongsTo(User::class, 'relationship_manager_user_id');
    }

    public function dedicatedAnalystUser() {
        return $this->belongsTo(User::class, 'dedicated_analyst_user_id');
    }

    public function contractedSystems() {
        return $this->belongsToMany(System::class, 'client_system', 'client_id', 'system_id');
    }

    public function serviceActivities() {
        return $this->belongsToMany(ServiceActivity::class, 'client_service_activity', 'client_id', 'service_activity_id');
    }

    public function projects() {
        return $this->hasMany(Project::class);
    }
}
