using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Keyless]
    public partial class VwStatsParticipation
    {
        public int Position { get; set; }
        public int Chrono { get; set; }
        public int NbJoueurs { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DateParticipation { get; set; }
        [Column("Nom de la course")]
        [StringLength(50)]
        [Unicode(false)]
        public string NomDeLaCourse { get; set; } = null!;
        [Column("Pseudo du joueur")]
        [StringLength(30)]
        public string PseudoDuJoueur { get; set; } = null!;
    }
}
