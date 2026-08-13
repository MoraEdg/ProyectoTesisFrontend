interface TarjetaMetricaProps {
  titulo:    string;
  valor:     number;
  icon:      string;
  bgColor:   string; // Tailwind class para el fondo del ícono
  iconColor: string; // Tailwind class para el color del ícono
}

export default function TarjetaMetrica({ titulo, valor, icon, bgColor, iconColor }: TarjetaMetricaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor}`}>
        <i className={`${icon} text-2xl ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{titulo}</p>
        <p className="text-3xl font-bold text-gray-800">{valor.toLocaleString('es-EC')}</p>
      </div>
    </div>
  );
}
