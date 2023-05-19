namespace SussyKart_Partie1.ViewModels
{
    public class ProfilVM
    {
        public string Pseudo { get; set; } = null!;
        public DateTime DateInscription { get; set; }
        public string Courriel { get; set; } = null!;
        public string NoBancaire { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public int? NombreAmi { get; set; }
    }
}
