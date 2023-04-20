using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Table("Course", Schema = "Courses")]
    [Index("Nom", Name = "UC_Course_Nom", IsUnique = true)]
    public partial class Course
    {
        public Course()
        {
            ParticipationCourses = new HashSet<ParticipationCourse>();
        }

        [Key]
        [Column("CourseID")]
        public int CourseId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Nom { get; set; } = null!;
        public int NbTours { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string Difficulte { get; set; } = null!;

        [InverseProperty("Course")]
        public virtual ICollection<ParticipationCourse> ParticipationCourses { get; set; }
    }
}
