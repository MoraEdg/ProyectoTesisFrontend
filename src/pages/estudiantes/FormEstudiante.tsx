import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { crearEstudiante, obtenerEstudiante, editarEstudiante } from '../../api/estudiantesApi';

interface CampoForm {
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono: string;
  carrera: string;
  matricula: string;
}

const INICIAL: CampoForm = {
  nombres: '', apellidos: '', cedula: '',
  correo: '', telefono: '', carrera: '', matricula: '',
};

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar(form: CampoForm, esEdicion: boolean): Record<string, string> {
  const err: Record<string, string> = {};
  if (!form.nombres.trim())   err.nombres   = 'El campo Nombres es obligatorio';
  if (!form.apellidos.trim()) err.apellidos  = 'El campo Apellidos es obligatorio';

  if (!esEdicion) {
    if (!form.cedula.trim()) {
      err.cedula = 'El campo Cédula es obligatorio';
    } else if (!/^\d+$/.test(form.cedula)) {
      err.cedula = 'La cédula debe contener solo dígitos';
    } else if (form.cedula.length < 10 || form.cedula.length > 13) {
      err.cedula = 'La cédula debe tener entre 10 y 13 dígitos';
    }
  }

  if (!form.correo.trim()) {
    err.correo = 'El campo Correo es obligatorio';
  } else if (!REGEX_CORREO.test(form.correo)) {
    err.correo = 'El correo electrónico no es válido';
  }

  if (!form.carrera.trim())   err.carrera   = 'El campo Carrera es obligatorio';
  if (!form.matricula.trim()) err.matricula = 'El campo Matrícula es obligatorio';

  return err;
}

export default function FormEstudiante() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm]           = useState<CampoForm>(INICIAL);
  const [errores, setErrores]     = useState<Record<string, string>>({});
  const [errorApi, setErrorApi]   = useState('');
  const [cargando, setCargando]   = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    if (!id) return;
    setCargandoDatos(true);
    obtenerEstudiante(id)
      .then((est) => {
        setForm({
          nombres:   est.nombres,
          apellidos: est.apellidos,
          cedula:    est.cedula,
          correo:    est.correo,
          telefono:  est.telefono ?? '',
          carrera:   est.carrera,
          matricula: est.matricula,
        });
      })
      .catch(() => navigate('/estudiantes'))
      .finally(() => setCargandoDatos(false));
  }, [id, navigate]);

  const handleChange = (campo: keyof CampoForm, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => { const n = { ...prev }; delete n[campo]; return n; });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorApi('');

    const errValidacion = validar(form, esEdicion);
    if (Object.keys(errValidacion).length > 0) {
      setErrores(errValidacion);
      return;
    }

    setCargando(true);
    try {
      if (esEdicion && id) {
        const { nombres, apellidos, correo, telefono, carrera, matricula } = form;
        await editarEstudiante(id, {
          nombres, apellidos, correo, carrera, matricula,
          ...(telefono ? { telefono } : {}),
        });
        navigate(`/estudiantes/${id}`);
      } else {
        const nuevo = await crearEstudiante({
          nombres: form.nombres,
          apellidos: form.apellidos,
          cedula: form.cedula,
          correo: form.correo,
          carrera: form.carrera,
          matricula: form.matricula,
          ...(form.telefono ? { telefono: form.telefono } : {}),
        });
        navigate(`/estudiantes/${nuevo.id_estudiante}`);
      }
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setErrorApi(apiErr.response?.data?.error ?? 'Error al guardar el estudiante');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {esEdicion ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h1>
      </div>

      {errorApi && (
        <div className="mb-4 px-4 py-3 rounded text-sm bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{errorApi}</span>
          <button onClick={() => setErrorApi('')} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Nombres */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombres *</label>
              <input
                type="text"
                value={form.nombres}
                onChange={(e) => handleChange('nombres', e.target.value)}
                className={`w-full h-12 px-4 text-sm border rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] ${errores.nombres ? 'border-red-400' : 'border-[#d8d8d8]'}`}
              />
              {errores.nombres && <p className="text-red-500 text-xs mt-1">{errores.nombres}</p>}
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Apellidos *</label>
              <input
                type="text"
                value={form.apellidos}
                onChange={(e) => handleChange('apellidos', e.target.value)}
                className={`w-full h-12 px-4 text-sm border rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] ${errores.apellidos ? 'border-red-400' : 'border-[#d8d8d8]'}`}
              />
              {errores.apellidos && <p className="text-red-500 text-xs mt-1">{errores.apellidos}</p>}
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cédula {!esEdicion && '*'}</label>
              <input
                type="text"
                value={form.cedula}
                onChange={(e) => handleChange('cedula', e.target.value)}
                disabled={esEdicion}
                className={`w-full h-12 px-4 text-sm border rounded outline-none ${esEdicion ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} ${errores.cedula ? 'border-red-400' : 'border-[#d8d8d8]'} focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)]`}
              />
              {errores.cedula && <p className="text-red-500 text-xs mt-1">{errores.cedula}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Correo *</label>
              <input
                type="email"
                value={form.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                className={`w-full h-12 px-4 text-sm border rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] ${errores.correo ? 'border-red-400' : 'border-[#d8d8d8]'}`}
              />
              {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="w-full h-12 px-4 text-sm border border-[#d8d8d8] rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)]"
              />
            </div>

            {/* Carrera */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Carrera *</label>
              <input
                type="text"
                value={form.carrera}
                onChange={(e) => handleChange('carrera', e.target.value)}
                className={`w-full h-12 px-4 text-sm border rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] ${errores.carrera ? 'border-red-400' : 'border-[#d8d8d8]'}`}
              />
              {errores.carrera && <p className="text-red-500 text-xs mt-1">{errores.carrera}</p>}
            </div>

            {/* Matrícula */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Matrícula *</label>
              <input
                type="text"
                value={form.matricula}
                onChange={(e) => handleChange('matricula', e.target.value)}
                className={`w-full h-12 px-4 text-sm border rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] ${errores.matricula ? 'border-red-400' : 'border-[#d8d8d8]'}`}
              />
              {errores.matricula && <p className="text-red-500 text-xs mt-1">{errores.matricula}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Link
              to={esEdicion && id ? `/estudiantes/${id}` : '/estudiantes'}
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark disabled:opacity-50 transition-colors"
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
