import { ESTADO_CIVIL, SEXO } from '@/enum/catalog'
import { queryKeys } from '@/lib/queryClient'
import type Persona from '@/models/api/entities/Persona'
import type {
  CrudField,
  CrudFilter,
  CrudSummaryItem,
  RelationTab,
} from '@/models/app/crud'
import { personaService } from '@/services/api'
import { enumOptions, humanize } from '@/utils/options'
import CrudView from '@/views/core/CrudView'
import ExpedienteView from '@/views/expediente/ExpedienteView'
import EconomiaView from '@/views/persona/EconomiaView'
import GrupoFamiliarView from '@/views/persona/GrupoFamiliarView'
import PersonaBeneficioView from '@/views/persona/PersonaBeneficioView'
import SituacionAcademicaView from '@/views/persona/SituacionAcademicaView'
import SituacionLaboralView from '@/views/persona/SituacionLaboralView'
import type { ColumnsType } from 'antd/es/table'

export default function PersonaView() {
  const sexoOptions = enumOptions(SEXO)
  const estadoCivilOptions = enumOptions(ESTADO_CIVIL)

  const columns: ColumnsType<Persona> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombres', dataIndex: 'nombres', key: 'nombres', align: 'center' },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
      align: 'center',
    },
    {
      title: 'Documento',
      dataIndex: 'documento_identificacion',
      key: 'documento_identificacion',
      align: 'center',
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
      align: 'center',
      render: (value?: string) => (value ? humanize(value) : '—'),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      align: 'center',
    },
  ]

  const fields: CrudField[] = [
    { name: 'nombres', label: 'Nombres', required: true },
    { name: 'apellidos', label: 'Apellidos', required: true },
    {
      name: 'fecha_nacimiento',
      label: 'Fecha de nacimiento',
      type: 'date',
      required: true,
    },
    { name: 'edad', label: 'Edad', type: 'number', required: true },
    {
      name: 'sexo',
      label: 'Sexo',
      type: 'select',
      required: true,
      options: sexoOptions,
    },
    {
      name: 'estado_civil',
      label: 'Estado civil',
      type: 'select',
      required: true,
      options: estadoCivilOptions,
    },
    { name: 'nacionalidad', label: 'Nacionalidad', required: true },
    { name: 'idioma', label: 'Idioma', required: true },
    { name: 'documento_identificacion', label: 'Documento de identificación' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'correo_electronico', label: 'Correo', type: 'email' },
    { name: 'discapacidad', label: 'Discapacidad' },
    { name: 'religion', label: 'Religión' },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
  ]

  const filters: CrudFilter[] = [
    { name: 'sexo', label: 'Sexo', options: sexoOptions },
    {
      name: 'estado_civil',
      label: 'Estado civil',
      options: estadoCivilOptions,
    },
  ]

  const toFormValues = (persona: Persona) => ({
    nombres: persona.nombres,
    apellidos: persona.apellidos,
    fecha_nacimiento: persona.fecha_nacimiento,
    edad: persona.edad,
    sexo: persona.sexo,
    estado_civil: persona.estado_civil,
    nacionalidad: persona.nacionalidad,
    idioma: persona.idioma,
    documento_identificacion: persona.documento_identificacion,
    direccion: persona.direccion,
    telefono: persona.telefono,
    correo_electronico: persona.correo_electronico,
    discapacidad: persona.discapacidad,
    religion: persona.religion,
    observaciones: persona.observaciones,
  })

  const summary = (persona: Persona): CrudSummaryItem[] => [
    {
      label: 'Nombre completo',
      value: `${persona.nombres} ${persona.apellidos}`,
    },
    { label: 'Documento', value: persona.documento_identificacion || '—' },
    { label: 'Sexo', value: persona.sexo ? humanize(persona.sexo) : '—' },
    {
      label: 'Estado civil',
      value: persona.estado_civil ? humanize(persona.estado_civil) : '—',
    },
    { label: 'Fecha de nacimiento', value: persona.fecha_nacimiento || '—' },
    { label: 'Edad', value: persona.edad ?? '—' },
    { label: 'Nacionalidad', value: persona.nacionalidad || '—' },
    { label: 'Teléfono', value: persona.telefono || '—' },
    { label: 'Correo', value: persona.correo_electronico || '—' },
    { label: 'Dirección', value: persona.direccion || '—' },
  ]

  const relations: RelationTab<Persona>[] = [
    {
      key: 'expediente',
      label: 'Expediente',
      render: (persona) => <ExpedienteView scopePersonaId={persona.id ?? 0} />,
    },
    {
      key: 'grupo-familiar',
      label: 'Grupo familiar',
      render: (persona) => (
        <GrupoFamiliarView scopePersonaId={persona.id ?? 0} />
      ),
    },
    {
      key: 'situacion-laboral',
      label: 'Situación laboral',
      render: (persona) => (
        <SituacionLaboralView scopePersonaId={persona.id ?? 0} />
      ),
    },
    {
      key: 'situacion-academica',
      label: 'Situación académica',
      render: (persona) => (
        <SituacionAcademicaView scopePersonaId={persona.id ?? 0} />
      ),
    },
    {
      key: 'economia',
      label: 'Economía',
      render: (persona) => <EconomiaView scopePersonaId={persona.id ?? 0} />,
    },
    {
      key: 'beneficios',
      label: 'Beneficios',
      render: (persona) => (
        <PersonaBeneficioView scopePersonaId={persona.id ?? 0} />
      ),
    },
  ]

  return (
    <CrudView<Persona>
      service={personaService}
      queryKey={queryKeys.personas}
      label="persona"
      columns={columns}
      fields={fields}
      filters={filters}
      toFormValues={toFormValues}
      fetchOne={(id) => personaService.findById({ id })}
      summary={summary}
      relations={relations}
    />
  )
}
